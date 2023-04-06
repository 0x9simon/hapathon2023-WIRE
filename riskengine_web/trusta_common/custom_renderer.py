from rest_framework.renderers import JSONRenderer
import json

response_code = {
    200: "请求成功",
    201: "请求成功",
    404: "没有请求到数据",
    -1: "请求失败"
}

class CustomJsonRenderer(JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        
        if renderer_context:

            response = renderer_context['response']
            if int(response.status_code) < 400:
                res = {
                    'code': response.status_code,
                    'msg': response_code.get(200, response_code[-1]),
                    'data': data,
                    "error_message": None
                }
            else:
                res = {
                    'code': response.status_code,
                    'msg': response_code.get(response.status_code, response_code[-1]),
                    'data': None,
                    "error_message": data
                }
            return super().render(res, accepted_media_type, renderer_context)
        else:
            return super().render(data, accepted_media_type, renderer_context)

