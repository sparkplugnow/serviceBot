#!/bin/sh

response=$1
echo $response
output=$(youtube-dl -o '/var/lib/mpd/music/%(title)s.%(ext)s' --extract-audio --audio-format mp3 ytsearch:"${response}"| grep mp3)

echo "$output"
echo response
# output='Adele - Hello.mp3'

refinedOutput=$(echo $output | cut -c42-)
# refinedOutput='Adele - Hello.mp3'
# refinedOutput=$(echo "'$refinedOutput'") 

mpc update 

# mpc search filename '$refinedOutput' | mpc add 
mpc search filename "${refinedOutput}" | mpc add
