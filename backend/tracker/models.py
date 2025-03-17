from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# ✅ Validierung für Gewichtseinträge
def validate_weight(value):
    if value <= 0:
        raise ValidationError("Das Gewicht muss größer als 0 sein.")    

# ✅ Benutzer-Manager für CustomUser
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Die E-Mail-Adresse muss angegeben werden")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra_fields)

# ✅ Benutzer-Modell (CustomUser)
class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username

# ✅ User-Profil-Modell
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    age = models.IntegerField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)  
    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female")], blank=True, null=True)

    def __str__(self):
        return f"Profil von {self.user.username}"

# ✅ Gewichtseintrag-Modell
class WeightEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    weight = models.FloatField(validators=[validate_weight])

    def __str__(self):
        return f"{self.user.username} - {self.weight} kg on {self.date}"







    

# Create your models here.
