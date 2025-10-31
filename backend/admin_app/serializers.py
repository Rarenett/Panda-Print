from rest_framework import serializers
from .models import CustomUser, Customer
from django.contrib.auth import authenticate

# -------------------------
# User Serializer
# -------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email']


# -------------------------
# Register Serializer
# -------------------------
class RegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True, required=False)
    dob = serializers.DateField(write_only=True, required=False)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'password', 'phone', 'dob']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        phone = validated_data.pop('phone', None)
        dob = validated_data.pop('dob', None)
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        Customer.objects.create(user=user, phone=phone, dob=dob)
        return user


# -------------------------
# Login Serializer
# -------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data.get('email'), password=data.get('password'))
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        return user
