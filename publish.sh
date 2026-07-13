#!/bin/bash

set -e

if [ -z "$1" ]; then
    echo "Użycie:"
    echo "./publish.sh \"Grodziski Rzeźnik — strona internetowa_v3\""
    exit 1
fi

SOURCE="/Users/michalsobczynski/Downloads/$1"
REPO="/Users/michalsobczynski/Downloads/Grodziski Rzeźnik — strona internetowa"

echo "📦 Kopiuję pliki..."

rsync -av \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='.thumbnail' \
  "$SOURCE/" \
  "$REPO/"

cd "$REPO"

echo "📄 Ustawiam index.html..."

cp "Grodziski Rzeznik.dc.html" index.html

echo
git status

echo
read -p "💬 Wiadomość commita: " MSG

git add -A
git commit -m "$MSG"
git push

echo
echo "✅ Gotowe!"
