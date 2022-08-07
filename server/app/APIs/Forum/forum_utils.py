# from server.app.APIs.Forum.forum_controller import DeletePost


from plistlib import UID
from sys import intern
from flask import jsonify
import requests
import re
from json import dumps
from requests import session
from sqlalchemy import null
from torch import is_same_size
from ...Models.model import  Calendar, Internship, City, Company, Comment, User, InternshipStatus,Student, File
from ...Models.company import Companies
from ...Models.forum import Post
from flask_restx import Resource, reqparse
from ...extension import db
from string import digits
import datetime
from sqlalchemy.sql.functions import coalesce
from sqlalchemy import nullslast
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, create_refresh_token, get_jwt_identity

class ForumUtils:
    def deletepost(id):
        obj = db.session.query(Post).filter(Post.id==id).one()
        try:

            db.delete(obj)
            db.session.commit()
            return dumps({'message': 'delete sucessfully'}), 200
        except Exception as error:

            return dumps({'msg': error}), 400
        pass
    def editPost(id,arg):

        Post.query.filter(Post.id == id).update({Post.content:arg['content']})
        try:
            db.session.commit()
            return dumps({'message': 'delete sucessfully'}), 200
        except Exception as error:

            return dumps({'msg': error}), 400
        pass
