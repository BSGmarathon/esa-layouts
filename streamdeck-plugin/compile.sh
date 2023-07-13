#!/bin/bash

if [  -L "./Release" ]; then
  mkdir "./Release"
fi

npm run build

rm ./Release/com.esamarathon.streamdeck.streamDeckPlugin > /dev/null 2>&1

zip -r ./Release/com.esamarathon.streamdeck.sdPlugin.zip com.esamarathon.streamdeck.sdPlugin/

mv ./Release/com.esamarathon.streamdeck.sdPlugin.zip ./Release/com.esamarathon.streamdeck.streamDeckPlugin

read -p "Press any key to continue..."
