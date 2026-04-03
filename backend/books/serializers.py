from rest_framework import serializers
from .models import Book
import datetime

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
    def validate_title(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long.")
        return value

    def validate_author(self, value):
        if not value.strip():
            raise serializers.ValidationError("Author cannot be empty.")
        return value

    def validate_published_year(self, value):
        current_year = datetime.datetime.now().year

        if value < 0:
            raise serializers.ValidationError("Year cannot be negative.")

        if value > current_year:
            raise serializers.ValidationError("Year cannot be in the future.")

        if value < 1000:
            raise serializers.ValidationError("Year seems too old.")

        return value

    def validate(self, data):
        title = data.get("title", "")
        author = data.get("author", "")

        if title.lower() == author.lower():
            raise serializers.ValidationError(
                "Title and author cannot be the same."
            )

        return data