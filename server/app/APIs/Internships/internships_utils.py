from plistlib import UID
from sys import intern
from flask import jsonify
import requests
import re
from json import dumps
from requests import session
from sqlalchemy import null
from torch import is_same_size
from ...Models.model import Calendar, StudentSkills,Internship, City, Company, Comment, User, Skill,InternshipStatus,Student, File
from flask_restx import Resource, reqparse
from ...extension import db
from string import digits
import datetime
from sqlalchemy.sql.functions import coalesce
from sqlalchemy import nullslast
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, create_refresh_token, get_jwt_identity

# YOUTUBE_KEY='AIzaSyAKgaoxXGkDNj1ouC4gW2Ks-_Mrw8eMuyM'
YOUTUBE_KEY = 'AIzaSyBKUlq8KO324Q996DMDXKLVnxGtvHKKPmk'


def get_location(data):
    id = City.id
    city = City.query.filter_by(id=data).first()
    if city:
        return city.name
    else:
        return ""


def get_company_info(data):
    id = Company.id
    company = Company.query.filter_by(id=data).first()

    print(company)
    name = company.company_name
    logo = company.company_logo

    return name, logo


def get_youtube(title):
    # remove stop words from title
    stop_words = ['intern', 'internship', 'summer']

    querywords = title.split()

    resultwords = [word for word in querywords if word.lower() not in stop_words]
    result = ' '.join(resultwords)

    # translate digits to None
    result = re.sub('[^A-Za-z ]+', '', result)

    # add courses to the search keywords
    res = result + ' courses'
    print(res)
    video_id_list = []
    search_url = 'https://www.googleapis.com/youtube/v3/search'

    search_params = {
        'key': YOUTUBE_KEY,
        'q': res,
        'part': 'snippet',
        'maxResult': 10,
        'type': 'video'
    }
    r = requests.get(search_url, params=search_params)

    results = r.json()['items']
    # print(results)

    if results is None:
        return 404

    for result in results:
        # print(result)
        videoid = result.get('id').get('videoId')
        print(videoid)
        video_id_list.append(videoid)

    return video_id_list


def changeTypeFormat(type):
    type = str(type)
    type1 = "fulltime"
    type2 = "parttime"
    if (type.lower() == type1) or (type.lower() == type2):
        return type
    else:
        return ""


def get_all_parent_comment(comments):
    all_parent_comment = []

    for comment in comments:
        children_comment = db.session.query(Comment).filter(Comment.parent_id == comment.id).all()
        children_comment_list = get_children_comment(children_comment)
        # print(children_comment_list)
        all_parent_comment.append({
            'text': comment.content,
            'uid': comment.user_id,
            'cmtId': comment.id,
            'time': str(comment.date),
            'replied': children_comment_list
        })
    return all_parent_comment


def get_children_comment(comments):
    all_children_comment = []
    for comment in comments:
        all_children_comment.append({
            'repliedId': comment.id,
            'text': comment.content,
            'time': str(comment.date),
            'uid': comment.user_id}, )

    # print(all_children_comment)
    return all_children_comment


def changeDateFormat(date):
    result = re.sub('T.+', '', str(date))
    return result


class InternshipsUtils:
    @staticmethod
    def get_Internship(id, data):
        is_save = "False"
        is_calendar = "False"

        try:
            # print(id)
            internship = Internship.query.filter(Internship.id == id).first()
            # print(internship)
            if not internship:
                internship_not_found = {
                    "message": "This internship does not exist"
                }
                return internship_not_found, 404
            else:

                uid = data.get("uid", None)
                print(uid)
                if uid is not None:

                    # update the interhsip status as is_seen
                    update = db.session.query(InternshipStatus) \
                        .filter(InternshipStatus.intern_id == id) \
                        .filter(InternshipStatus.uid == uid) \
                        .update({InternshipStatus.is_seen: "True"})
                    if update:
                        db.session.commit()

                    else:
                        save_internship = InternshipStatus(uid=uid, intern_id=id, is_seen="True")
                        db.session.add(save_internship)
                        db.session.commit()

                    # check if it is saved
                    status = db.session.query(InternshipStatus).filter(InternshipStatus.intern_id == id) \
                        .filter(InternshipStatus.uid == uid).first()

                    if status.is_save == "True":
                        is_save = "True"

                    # check if this internship is in the calendar
                    student = db.session.query(Student).join(User, Student.email == User.email).filter(
                        User.uid == uid).first()
                    if student:
                        calendar = db.session.query(Calendar).filter(Calendar.internship_id == id) \
                            .filter(Calendar.student_id == student.id)

                        if calendar:
                            is_calendar = "True"
                # get comment list
                comment_list = []
                comment = db.session.query(Comment).join(Internship, Comment.internship_id == Internship.id).filter(
                    Comment.internship_id == id).filter(Comment.parent_id == 0).all()

                if comment:
                    comment_list = get_all_parent_comment(comment)
                    print(comment_list)

                # job_skill = db.session.query(Skill).filter(Skill.internships.any(id = data)).all()
                # skills_list = []

                # if job_skill:
                #     for skill in job_skill:
                #         skills_list.append(skill.name)
                #     print(skills_list)

                # get related course id
                video_id_list = get_youtube(internship.title)
                if video_id_list == 404:
                    return {'msg': "API KEY PROBELMS"}, 404

                internship_result = {
                    "description": internship.description,
                    "postedDate": changeDateFormat(internship.posted_time),
                    "closedDate": changeDateFormat(internship.expiration_datetime_utc),
                    "companyId": internship.company_id,
                    'internship_id': internship.id,
                    "comment": comment_list,
                    "jobTitle": internship.title,
                    "jobType": changeTypeFormat(internship.type),
                    "remote": internship.is_remote,
                    "min_salary": internship.min_salary,
                    "max_salary": internship.max_salary,
                    "salary_currency": internship.salary_curreny,
                    "location": get_location(internship.city),
                    "companyName": get_company_info(internship.company_id)[0],
                    'company_logo': get_company_info(internship.company_id)[1],
                    "video_id": video_id_list,
                    "recruiting_process": [],
                    "is_save": is_save,
                    "is_calendar": is_calendar

                }
                return internship_result, 200
        except  Exception as error:
            print(error)
            return {
                       "message": "something wrong internal"
                   }, 500

    @staticmethod
    def get_all_Internship(data):

        job = data.get("job", None)
        # location = data['location']
        location = data.get("location", None)
        sort = data.get("sort", "Default")
        paid = data.get("paid", None)
        remote = data.get("is_remote", None)

        if paid:
            paid = paid.upper()
        if remote:
            remote = remote.upper()

        job_type = data.get("job_type", None)
        current_page = int(data.get('current_page', 1))
        map = []

        if job is not None:
            job = data['job']
            map.append(Internship.title.ilike(f'%{job}%'))
        if paid == "TRUE":
            map.append(Internship.min_salary != "")
        if paid == "FALSE":
            map.append(Internship.max_salary == "")
        if remote == "TRUE" or remote == "FALSE":
            print(remote)
            map.append(Internship.is_remote == remote)
        if job_type is not None:
            map.append(Internship.type.ilike(f'%{job_type}%'))

        # print(map)

        if location is not None:
            location = data['location']

            temp = db.session.query(Internship.id).join(City).filter(City.name.ilike(f'%{location}%')).subquery()

            if sort == "Default":
                result = Internship.query.filter(*map).filter(Internship.id.in_(temp)).order_by(Internship.id.asc())

            elif sort == "Newest":
                result = Internship.query.filter(*map).filter(Internship.id.in_(temp)).order_by(
                    Internship.posted_time.desc())

            elif sort == "Closing Soon":
                result = Internship.query.filter(*map).filter(Internship.id.in_(temp)).order_by(
                    Internship.expiration_datetime_utc is None, Internship.expiration_datetime_utc.asc())

        elif location is None:
            if sort == "Default":
                result = Internship.query.filter(*map).order_by((Internship.id.asc()))

            elif sort == "Newest":
                result = Internship.query.filter(*map).order_by((Internship.posted_time.desc()))

            elif sort == "Closing Soon":
                result = Internship.query.filter(*map).order_by(Internship.expiration_datetime_utc is None,
                                                                Internship.expiration_datetime_utc.asc())

        count = result.count()
        print(count)
        internships = result.paginate(page=current_page, per_page=10, error_out=False).items

        all_internships = [{'job_id': internship.id, 'title': internship.title,
                            'job_type': changeTypeFormat(internship.type), "status": "",
                            'is_remote': internship.is_remote, 'posted_time': changeDateFormat(internship.posted_time),
                            'closed_time': changeDateFormat(internship.expiration_datetime_utc),
                            'min_salary': internship.min_salary, 'max_salary': internship.max_salary,
                            'description': internship.description, "salary_currency": internship.salary_curreny,
                            'numAllResults': {"total_count": count}, 'location': get_location(internship.city),
                            'company_id': internship.company_id,
                            'company_name': get_company_info(internship.company_id)[0],
                            'company_logo': get_company_info(internship.company_id)[1]
                            } for internship in internships]

        return jsonify(all_internships)

    @staticmethod
    def comment(id, data):
        result = Internship.query.filter(Internship.id == id).first()
        print(result)
        current_user_id = get_jwt_identity()
        print(current_user_id)
        print(result)
        comment = data.get("comment", None)
        parent_id = data.get("parent_id", None)

        if result is not None:

            ct = datetime.datetime.now()

            if comment is not None and parent_id is not None:
                newComment = Comment(content=data['comment'], parent_id=data['parent_id'], internship_id=id,
                                     user_id=current_user_id, date=ct)

            elif comment is not None and parent_id is None:
                newComment = Comment(content=data['comment'], internship_id=id, user_id=current_user_id, date=ct)

            try:
                db.session.add(newComment)
                db.session.commit()
                return dumps({'message': 'yes', 'comment_id': newComment.id}), 200
            except Exception as error:
                return dumps({'msg': error}), 400

        return dumps({'msg': 'no related internship'})

    @staticmethod
    def appliedfor(arg):
        # id = arg['id']

        # uid should not be 102, should change later
        is_applied = db.session.query(Internship).join(InternshipStatus, Internship.id == InternshipStatus.intern_id) \
            .filter(InternshipStatus.uid == 102).filter(InternshipStatus.is_applied == "True").all()
        if is_applied:
            info = []
            for applied in is_applied:
                info.append(Internship.get_info(applied))
            result = {
                "is_applied": info
            }
            return result, 200
        else:
            return dumps({"msg": "Internship not found"}), 404

    @staticmethod
    def apply(arg):
        current_user_id = get_jwt_identity()
        print(current_user_id)
     

        internship_id = arg.get('internship_id')
        internship=Internship.query.filter(id==internship_id).first()
        resume = arg.get('resume', None)
        coverletter = arg.get('coverletter', None)
        
        question = arg.get('question')
        answer = arg.get('answer')
        if internship:
            apply =  db.session.query(InternshipStatus)\
                .filter(InternshipStatus.intern_id == internship_id )\
                .filter(InternshipStatus.uid==current_user_id)\
                .update({InternshipStatus.is_applied: "True"})

            if resume:
                file = File(student_id = 102, data = resume, file_type = "resume", upload_time = datetime.datetime.now())
                db.session.add(file)
            if coverletter:
                file = File(student_id = 102, data = coverletter, file_type = "coverletter", upload_time = datetime.datetime.now())
                db.session.add(file)
            db.session.commit()
            return dumps({"msg": "save sucessfully"}), 200
        else:

            return dumps({"msg": "Internship not found"}), 404

    @staticmethod
    def getSaveList(arg):

        # id = arg['id']
        # uid should not be 102, should change later
        is_save = db.session.query(Internship) \
            .join(InternshipStatus, Internship.id == InternshipStatus.intern_id) \
            .filter(InternshipStatus.uid == 102).filter(InternshipStatus.is_save == "True").all()
        if is_save:
            info = []
            all_internships = [{'job_id': internship.id, 'title': internship.title, \
                                'job_type': changeTypeFormat(internship.type), "status": "",
                                'is_remote': internship.is_remote,
                                'posted_time': changeDateFormat(internship.posted_time),
                                'closed_time': changeDateFormat(internship.expiration_datetime_utc), \
                                'min_salary': internship.min_salary, 'max_salary': internship.max_salary,
                                'description': internship.description, "salary_currency": internship.salary_curreny, \
 \
                                'location': get_location(internship.city), 'company_id': internship.company_id, \
                                'company_name': get_company_info(internship.company_id)[0],
                                'company_logo': get_company_info(internship.company_id)[1]
                                } for internship in is_save]
            # for save in is_save:
            #     info.append(Internship.get_info(save))
            # # print(info)
            result = {
                "is_save": all_internships,

            }
            # print(result)
            return result, 200

        else:
            return dumps({"msg": "Internship not found"}), 404

    @staticmethod
    def saveInternship(arg):
        internship_id = arg.get('internship_id')
        # (internship_id)
        print(internship_id)
        # #uid will change later, could not be 102
        internship = Internship.query.filter(Internship.id == internship_id).first()
        if not internship:
            return dumps({"msg": "Internship not found"}), 404
        update = db.session.query(InternshipStatus) \
            .filter(InternshipStatus.intern_id == internship_id) \
            .filter(InternshipStatus.uid == 102) \
            .update({InternshipStatus.is_save: "True"})
        if update:
            db.session.commit()
            return dumps({"msg": "save sucessfully"}), 200
        else:
            save_internship = InternshipStatus(uid=102, intern_id=internship_id, is_save="True")
            db.session.add(save_internship)
            return dumps({"msg": "add save sucessfully"}), 200

    @staticmethod
    def unSaveInternship(arg):
        internship_id = arg.get('internship_id')
        print(internship_id)

        update = db.session.query(InternshipStatus) \
            .filter(InternshipStatus.intern_id == internship_id) \
            .filter(InternshipStatus.uid == 102) \
            .update({InternshipStatus.is_save: "False"})
        if update:
            db.session.commit()
            return dumps({"msg": "unsave sucessfully"}), 200
        else:
            return dumps({"msg": "Internship not found"}), 404

    @staticmethod
    def getViewedHistory(arg):
        is_seen = db.session.query(Internship).join(InternshipStatus, Internship.id == InternshipStatus.intern_id) \
            .filter(InternshipStatus.uid == 102).filter(InternshipStatus.is_seen == "True").all()
        if is_seen:
            info = []
            for applied in is_seen:
                info.append(Internship.get_info(applied))
            result = {
                "is_seen": info
            }
            return result, 200
        else:
            return dumps({"msg": "Internship not found"}), 404

    @staticmethod
    def getCalendar(arg):
        get_student = db.session.query(Student).filter(Student.id == 102)
        if not get_student:
            return {
                       'msg': 'no related student'
                   }, 400

        calendars = db.session.query(Calendar).filter(Calendar.student_id == 102)
        calander_list = []
        if calendars:
            for calendar in calendars:
                calendar_result = {
                    'internship_id': calendar.id,
                    'student_id': calendar.student_id,
                    'start': calendar.start,
                    'end': calendar.end,
                    'title': calendar.title,
                    'type': calendar.type,
                    'link': calendar.link,
                    'is_calendar': calendar.is_calendar
                }
                calander_list.append(calendar_result)

        return calander_list, 200

    @staticmethod
    def addCalendar(arg):
        get_student = db.session.query(Student).filter(Student.id == 102)
        if not get_student:
            return {
                       'msg': 'no related student'
                   }, 400
        data = arg
        newCalendar = Calendar(title=data['name'], type=data['type'] \
                               , start=data['start'], end=data['end'], internship_id=data['internshipId'], \
                               user_id=data['uid'])

        try:
            db.session.add(newCalendar)
            db.session.commit()

            return dumps({'message': 'yes', 'comment_id': newCalendar.id}), 200
        except Exception as error:

            return dumps({'msg': error}), 400

    @staticmethod
    def deleteCalendar(arg):
        get_student = db.session.query(Student).filter(Student.id == 102)
        if not get_student:
            return {
                       'msg': 'no related student'
                   }, 400

        obj = Calendar.query.filter_by(id=arg['id']).one()
        try:

            db.delete(obj)
            db.session.commit()
            return dumps({'message': 'delete sucessfully'}), 200
        except Exception as error:

            return dumps({'msg': error}), 400

    @staticmethod
    def getRecommend(arg):

        type = arg['type']

        get_student = db.session.query(Student).filter(Student.id == 2)
        if not get_student:
            return {
                       'msg': 'no related student'
                   }, 400

        student = db.session.query(Student).join(User, Student.email == User.email).filter(User.uid == 105).first()

        if student:
            print("zzzzzzzz")
            student_id = student.id
            print(student_id)
            skills = db.session.query(StudentSkills).filter(StudentSkills.student_id == student_id).all()
            print(skills)
            for skill in skills:
                if type == 'recommend':
                    print(skill.skill_id)
                    internships = db.session.query(Internship).join(Internship.skills).filter(Skill.id == skill.skill_id)
                    print(internships)
                elif type == 'closing':
                    internships = db.session.query(Internship).join(Internship.skills).filter(Skill.id == skill.skill_id).order_by(Internship.expiration_datetime_utc == None,Internship.expiration_datetime_utc.asc())
                elif type =='new':
                    internships = db.session.query(Internship).join(Internship.skills).filter(Skill.id == skill.skill_id).order_by((Internship.posted_time.desc()))
       
        all_internships = [{'job_id': internship.id,'title':internship.title, \
             'job_type': changeTypeFormat(internship.type),"status": "",'is_remote':internship.is_remote , 'posted_time':changeDateFormat( internship.posted_time), 'closed_time':changeDateFormat(internship.expiration_datetime_utc),\
                'min_salary':internship.min_salary, 'max_salary': internship.max_salary, 'description':internship.description,   "salary_currency": internship.salary_curreny,\

                    'location': get_location(internship.city), 'company_id': internship.company_id,\
                        'company_name': get_company_info(internship.company_id)[0], 'company_logo': get_company_info(internship.company_id)[1]
           } for internship in internships]
        return jsonify(all_internships)
