import os
import tornado.ioloop #@UnresolvedImport
import tornado.web #@UnresolvedImport
import xml.etree.ElementTree
import thread, time, threading


data = xml.etree.ElementTree.ElementTree()


# DataStructure 
# wall[id].x
# wall[id].y
##
wallLock = threading.Lock()
wall = {}

deletionLock = threading.Lock()
deletionDict = {}

def ageIds(sleeptime):
	global deletionDict
	global wall
	while 1:
		removel = [] 
		deletionLock.acquire()
		for (id, age) in deletionDict.iteritems():
			if age > 50:
				# possible bug
				removel.append(id)
			else:
				deletionDict[id]+=1
				if (id in wall):
					wallLock.acquire()
					del wall[id]
					wallLock.release()
		for a in removel:
			del deletionDict[a]
		deletionLock.release()
		time.sleep(	sleeptime ) 
			

class SyncHandler(tornado.web.RequestHandler):
	def get(self):
		self.write("hello?")
	def post(self): 
		xmltext = self.request.body
		tree = xml.etree.ElementTree.fromstring(xmltext)
		for object in tree.findall("object"):
			# grab the _id from the object
			# add it to data structure, or update if already present
			id = object.find("id")
			# check timestamp is more recent, if not leave.
			#print "new object timestamp: ", int(object.findtext("timestamp"))
			if (id.text not in wall) or int(object.findtext("timestamp")) > int(wall[id.text].findtext("timestamp")):
				wall[id.text] = object
		for deleteobject in tree.findall("deletion"):
			id = deleteobject.find("id")
			if (id.text in wall):
				print "DELETE OBJECT:", id.text
				deletionDict[id.text] = 0
				wallLock.acquire()
				del wall[id.text]
				wallLock.release()
				
			
		# respond with the wall data
		self.set_header('Content-Type', 'text/xml')
		self.write(globs_to_xml())
		useful_debug()

def useful_debug(): 
	wallLock.acquire()
	for (id, object) in wall.iteritems():
		print "id:", id,
		print "x:", object.findtext("x"), "y:", object.findtext("y"), "text:", object.findtext("text")
	wallLock.release()
		
		

def globs_to_xml():
	root = xml.etree.ElementTree.Element("sync")
	wallLock.acquire()
	for (id, object) in wall.iteritems():
		xmlObject = xml.etree.ElementTree.Element("object")
		xmlObject.attrib['id'] = id
		xmlObject.extend(object)		
		root.append(xmlObject)
	wallLock.release()
	deletionLock.acquire()
	for (id, age) in deletionDict.iteritems():
		xmlObject = xml.etree.ElementTree.Element("deletion")
		xmlObject.attrib['id'] = id
#		xmlObject.attrib['age'] = age
		root.append(xmlObject)
	deletionLock.release()
	return xml.etree.ElementTree.tostring(root)
		
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
		
settings = {
   "static_path": os.path.join(os.path.dirname(__file__), "static")
}

application = tornado.web.Application([
    (r"/", MainHandler),
	(r"/sync", SyncHandler),
], **settings)

if __name__ == "__main__":
    thread.start_new_thread(ageIds, (1,))
    application.listen(8080)
    tornado.ioloop.IOLoop.instance().start()
