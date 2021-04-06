txtrst=$(tput sgr0) # Text reset
txtyel=$(tput setaf 7) # Yellow
txtgrn=$(tput setaf 6) # Green
txtred=$(tput setaf 9) # red
cd live-api
echo ${txtyel}generating docs for live-api
apidoc -i v1/src/  -f .js -o v1/doc/ -t ../template-v3
echo ${txtgrn}Finished!
echo ${txtrst}
