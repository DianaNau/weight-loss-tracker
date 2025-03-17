from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token  
from django.contrib.auth import get_user_model  
from .models import WeightEntry
from .serializers import UserSerializer, WeightEntrySerializer

User = get_user_model()

# ✅ Registrierung
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # ✅ Automatisch Token für den Benutzer erstellen
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Registrierung erfolgreich",
                "token": token.key,  # Token zurückgeben
                "user": {"id": user.id, "username": user.username}
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Login mit Token-Erstellung
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            # ✅ Token für den Nutzer holen oder erstellen
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Login erfolgreich",
                "token": token.key,  # ✅ Richtiger Token zurückgeben
                "user": {"id": user.id, "username": user.username}
            }, status=status.HTTP_200_OK)
        return Response({"error": "Ungültige Anmeldeinformationen"}, status=status.HTTP_400_BAD_REQUEST)

# ✅ Logout (Token löschen)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Nur eingeloggte Nutzer können sich ausloggen

    def post(self, request):
        request.user.auth_token.delete()  # ✅ Token löschen
        logout(request)
        return Response({"message": "Erfolgreich ausgeloggt"}, status=status.HTTP_200_OK)

# ✅ Gewichtseinträge (GET & POST)
class WeightEntryView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Nur eingeloggte Nutzer

    def get(self, request):
        user = request.user
        entries = WeightEntry.objects.filter(user=user).order_by("-date")
        serializer = WeightEntrySerializer(entries, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        data = request.data.copy()
        data["user"] = user.id  # ✅ User-ID hinzufügen
        serializer = WeightEntrySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



