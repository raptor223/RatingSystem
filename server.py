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
			(r"/static/css(.*)", tornado.web.StaticFileHandler)
			#(r"/dashboard", DashboardHandler),
			#(r"/dashboardWithSession", DashboardSessionHandler),
			#(r"/login", LoginHandler),
			#(r"/register", RegisterHandler),
			#(r"/updateAccount", UpdateAccForWalletHandler),
			#(r"/logout", LogoutHandler),

			#(r"/account", AccountHandler),
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