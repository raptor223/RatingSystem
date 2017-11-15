import sys
import yaml 
import logging.config 
import json 
import os 
import socket 
import tornado.httpserver 
import tornado.ioloop 
import psycopg2
import momoko
import hashlib

from tornado import web
from tornado import websocket
from tornado.web import asynchronous 
from tornado.options import options
from tornado import gen
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.options import parse_command_line

DEFAULT_CONFIG_FILE = 'config/myconfig.yaml'

class Application(tornado.web.Application):

	def __init__(self, config):
		
		self.logger = logging.getLogger(__name__)
		
		settings = dict(
			title=u"Cryptonomy - RatingSystem",
			static_path = "static",
			template_path=os.path.join(os.path.dirname(__file__), "www"),
			autoescape=None,
		)

		handlers = [
			(r"/", MainHandler),
			(r"/static/(.*)", tornado.web.StaticFileHandler),
			(r"/static/css(.*)", tornado.web.StaticFileHandler),
			#(r"/dashboard", DashboardHandler),
			#(r"/dashboardWithSession", DashboardSessionHandler),
			#(r"/login", LoginHandler),
			#(r"/register", RegisterHandler),
			#(r"/updateAccount", UpdateAccForWalletHandler),
			#(r"/logout", LogoutHandler),

			(r"/account", AccountHandler),
			(r"/accountAdmin", AccountAdminHandler),
			(r"/newWebsiteRequest", WebsiteHandler),
			(r"/websiteAvailable", WebsiteHandler),
			(r"/accountSignin", LoginHandler),
			(r"/websiteRating", RatingHandler),
			(r"/getUserRating", UserRatingHandler),
			(r"/acceptRequestWebsiteItem", WebsiteRequestHandler)
			#(r"/walletHandler", WalletHandler),
			#(r"/walletAmountHandler", WalletAmountHandler),
			#(r"/updateDashboard", WS_UpdateDashboardHandler)

			#(r"/navbarTemplate(.*)", TemplateHandler)
		]
		self.config = config

		
		
		super(Application, self).__init__(handlers, debug=True, **settings)

		self.logger.info("Server successfully started")


class BaseDatabaseHandler(tornado.web.RequestHandler):
	
	@property
	def db(self):
		return self.application.db

class MainHandler(BaseDatabaseHandler):

	def get(self):
		self.render("index.html")

class LoginHandler(BaseDatabaseHandler):

	@gen.coroutine
	def post(self):
		try:

			data = json.loads(self.request.body)
			userCursor = yield self.db.execute("SELECT * FROM benutzer;",(1,))

			userExist = False;
			userIsAdmin = False;


			for user in userCursor:
				if user[1] == data['Username']:

					userExist = True;
					#Check if it is a admin
					try:


						adminCursor = yield self.db.execute("SELECT benutzername FROM administrator WHERE benutzername='"+data['Username']+"';",(1,))
						for admin in adminCursor:
							self.set_status(200, "User is admin.")
							self.write(json.dumps(dict(
								admin=True
							)))
							self.finish()
						break;

					except Exception as error:
						print("No Admin Error")

			if userExist == True:
				print("Valid username!")
				self.set_status(202, "Username valid!")
				self.write(json.dumps(dict(
							admin=False
				)))
				self.finish()

			else:
				self.set_status(404, "User does not exist!")
				self.finish()

		except Exception as error:
			print(error)

class AccountAdminHandler(BaseDatabaseHandler):

	@gen.coroutine
	def post(self):
		try:
			
			data = json.loads(self.request.body)
			cursor = yield self.db.execute("SELECT * FROM benutzer;",(1,))

			userTaken = False;

			for user in cursor:
				if user[1] == data['Username']: #Check if username is already taken
					userTaken = True;
					cursorUser = yield self.db.execute("INSERT INTO administrator(benutzername, rolle) VALUES('"+data['Username']+"', 'chef');")
					self.set_status(202, "User "+data['Username']+" was set as Admin")
					self.finish()
					break;
				else:
					userTaken = False;
					

			if userTaken == False:
				print("User "+data['Username'] + " does not exist!")

		except Exception as error:
			self.set_status(401)
			self.write(str(error))
			self.finish()
			print(error)

class AccountHandler(BaseDatabaseHandler):

	@gen.coroutine
	def post(self):
		try:
			
			data = json.loads(self.request.body)
			cursor = yield self.db.execute("SELECT * FROM benutzer;",(1,))

			userTaken = False;

			for user in cursor:
				if user[1] == data['Username']: #Check if username is already taken
					print("User already taken")
					userTaken = True;
					self.set_status(401)
					self.finish()
					break;
				else:
					userTaken = False;

			if userTaken == False:
				#self.hashing.update(data['Username'])
				#userhash = self.hashing.hexdigest()
				cursorUser = yield self.db.execute("INSERT INTO benutzer(benutzername, passwort) VALUES('"+data['Username']+"', '"+data['Password']+"');")
				cursorStimme = yield self.db.execute("INSERT INTO stimme(benutzername, einfluss) VALUES('"+data['Username']+"', 0.0)")
				#self.cb.createNewUserDocument(userhash, data['Username'])
				self.set_status(202, "User created! Well played")
				self.finish()

		except Exception as error:
			self.set_status(401)
			self.write(str(error))
			self.finish()
			print(error)

class WebsiteHandler(BaseDatabaseHandler):

	@gen.coroutine
	def post(self):

		try:
			data = json.loads(self.request.body)

			websiteRequest = yield self.db.execute("SELECT * FROM webseitenanfrage;",(1,))
			websiteTaken = False;
				
			website = yield self.db.execute("INSERT INTO webseitenanfrage(url, webname, land) VALUES('"+data['URL']+"', '"+data['Webname']+"', '"+data['Land']+"');")
			self.set_status(202, "WebsiteRequest created! Well played!")
			self.finish()
		except Exception as error:
			self.set_status(403)
			self.write("Webseite bereits vorhanden!")
			self.finish()
			print(error)

	#Get WebsiteRequests for User
	@gen.coroutine
	def get(self):

		try:
			username = self.get_argument('Username')
			showAsUser = self.get_argument('ShowAsUser')
			print(showAsUser)

			userCheck = yield self.db.execute("SELECT benutzername FROM benutzer WHERE benutzername='"+username+"';",(1,))
			adminCheck = yield self.db.execute("SELECT benutzername FROM administrator WHERE benutzername='"+username+"';",(1,))

			print("Check Items for Admins or Users")
			websiteRequestList = [];
			
			userResult = userCheck.fetchall()
			adminResult = adminCheck.fetchall()

			print(len(userResult))
			print(len(adminResult))

			if len(adminResult) >= 1 and showAsUser=='false':
				print("User is ADMIN!")
				for admin in adminResult:
					websiteRequest = yield self.db.execute("SELECT websiteid, url, webname, land FROM webseitenanfrage WHERE genehmigtvonadmin IS NULL;",(0,))
					websiteRequestList = websiteRequest.fetchall()
					print(websiteRequestList)

			elif(len(userResult) >= 1 and showAsUser=='true'):
				print("User is normal User!")
				for user in userResult:
					print(user)
					websiteRequest = yield self.db.execute("SELECT websiteid, url, webname, land FROM webseitenanfrage WHERE genehmigtvonadmin IS NOT NULL;",(0,))
					websiteRequestList = websiteRequest.fetchall()
					print(websiteRequestList)

			websiteAvailable = {}

			for website in websiteRequestList:
				#websiteAvailable['ID'] = website[0]
				#print(website)
				data = {
					#websiteAvailable['URL'] = website[1]
					'WebsiteID' : website[0],
					'URL' : website[1],
					'Webname' : website[2],
					'Country' : website[3],
					'ShowAsUser' : showAsUser
					#websiteAvailable['Webname'] = website[2]
					#websiteAvailable['Country'] = website[3]
				}
				websiteAvailable.update({website[0]:data})

			json_data = json.dumps(websiteAvailable)
			self.write(json_data)
			#print(json_data)
			self.finish()
		except Exception as error:
			print(error)

class WebsiteRequestHandler(BaseDatabaseHandler):

	@gen.coroutine
	def post(self):

		try:
			data = json.loads(self.request.body)
			print(data)
			websiteRequestAdmin = yield self.db.execute("SELECT benutzername FROM administrator WHERE benutzername='"+data['Username']+"';",(1,))
			
			websiteRequest = yield self.db.execute("UPDATE webseitenanfrage SET genehmigtvonadmin=(SELECT userid FROM benutzer WHERE benutzername=(SELECT benutzername FROM administrator WHERE benutzername='"+data['Username']+"')) WHERE websiteid="+str(data[ 'WebsiteID'])+";",(1,))
			self.finish()
		except Exception as error:
			print(error)

class RatingHandler(BaseDatabaseHandler):

	@gen.coroutine
	def post(self):

		try:
			data = json.loads(self.request.body)

			user = yield self.db.execute("SELECT userid FROM benutzer WHERE benutzername='"+data["Username"]+"';",(1,))
			stimme = yield self.db.execute("SELECT stimmenid FROM stimme WHERE benutzername='"+data["Username"]+"';",(1,))
			for userid in user:
				for stimmenid in stimme:
					ratingInsert = yield self.db.execute("INSERT INTO webseitenstimme(stimmenid, websiteid, userid, gewichtung) VALUES("+str(stimmenid[0])+","+str(data['WebsiteID'])+", "+str(userid[0])+", "+str(data['Rating'])+");")



		except Exception as error:
			print(error)

class UserRatingHandler(BaseDatabaseHandler):

	@gen.coroutine
	def get(self):

		try:
			username = self.get_argument('Username')
			websiteid = self.get_argument('WebsiteID')
			
			userID = yield self.db.execute("SELECT stimmenid FROM stimme WHERE benutzername='"+username+"';",(1,))
			ratingNumbers = yield self.db.execute("SELECT websiteid,gewichtung FROM webseitenstimme WHERE stimmenid=(SELECT stimmenid FROM stimme WHERE benutzername='"+username+"') AND websiteid="+websiteid+" ;")

			websiteRatings = {}

			for rating in ratingNumbers:

				#websiteAvailable['ID'] = website[0]
				#print(website)
				data = {
					'WebsiteID' : int(rating[0]),
					'Gewichtung' : int(rating[1]),
				}
				websiteRatings.update({'data':data})

			json_data = json.dumps(websiteRatings)
			self.write(json_data)

		except Exception as error:
			print(error)



def main():
	try:
		print "Load config: "+ str(DEFAULT_CONFIG_FILE)
		config = yaml.load(file(DEFAULT_CONFIG_FILE, 'r'))
		print str(config)
	except:
		print "No config File found. Please check the config directory"

	try:
		tornado.options.parse_command_line()

		#str(config)
		application = Application(config)

		ioloop = tornado.ioloop.IOLoop.instance()

		application.db = momoko.Pool(
			dsn = 'dbname=cryptonomy user=cryptonomy password=cryptonomy host=localhost port=5432',
			size = 1,
			ioloop = ioloop
		)

		future = application.db.connect()

		ioloop.add_future(future, lambda f: ioloop.stop())
		ioloop.start()

		http_server = tornado.httpserver.HTTPServer(application)
		http_server.listen(config['server']['port'])
		ioloop.start()

	except socket.error as err:
		print "Could not start Server"
		print err

	except IOError as err:
		print "Could not connect to database"
		print err

	except KeyboardInterrupt:
		print("Error 999: User abort")


if __name__=="__main__":
	main()