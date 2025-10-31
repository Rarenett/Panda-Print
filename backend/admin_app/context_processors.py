
from admin_app.models import Menu, MenuPermission

def permitted_menus(request):
    user = request.user

    # Superusers see all menus
    if user.is_authenticated and user.is_superuser:
        menus = Menu.objects.prefetch_related("submenus").all()
        menu_list = []
        for menu in menus:
            menu_list.append({
                "menu": menu,
                "submenus": menu.submenus.all()
            })
        return {"menus": menu_list}

    # Normal users
    user_profile = getattr(user, "userprofile", None)
    if not user_profile:
        return {"menus": []}

    allowed_submenu_ids = MenuPermission.objects.filter(
        user_profile=user_profile
    ).values_list("submenu_id", flat=True)

    menus = []
    for menu in Menu.objects.prefetch_related("submenus").all():
        allowed_subs = menu.submenus.filter(id__in=allowed_submenu_ids)
        if allowed_subs.exists():
            menus.append({
                "menu": menu,
                "submenus": allowed_subs
            })

    return {"menus": menus}