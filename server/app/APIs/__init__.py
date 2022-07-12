from flask_restx import Api
from flask import Blueprint

from .Auth.auth_controller import auth_api as auth
from .Company_page.company_page_controller import company_page_api as company_page
from .Forum.forum_controller import forum_api as forum
from .Internships.internships_controller import internships_api as internships

# Import controller APIs as namespaces.
api_bp = Blueprint("api", __name__)

api = Api(api_bp, title="API", description="InternHub Main routes.")

# API namespaces
api.add_namespace(auth)
api.add_namespace(company_page)
api.add_namespace(forum)
api.add_namespace(internships)