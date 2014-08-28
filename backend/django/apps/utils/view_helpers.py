from django.shortcuts import render

def render_form_errors(request, message, obj):
    return render(request, "global/error.html", {
        'message': message,
        'error': obj.errors
    })
