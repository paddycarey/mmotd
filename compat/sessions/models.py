from google.appengine.ext import ndb

class Session(ndb.Model):
    session_key = ndb.StringProperty()
    session_data = ndb.TextProperty()
    expire_date = ndb.DateTimeProperty()
