#!/bin/bash
directory="$(pwd)/*"
getFileExtension() {
  local filename=$(basename -- $1)
  local extension="${filename##*.}"
  echo $extension
}

compress() {
  case $(getFileExtension $1) in
    jpg) jpegoptim -S 80% $1;;
    png) pngquant --ext .png -f $1;;
    gif) gifsicle --resize 30x21 $1 -O3 --colors 8 -o $1;;
    *) echo "skipping compression";;
  esac
  }

batchCompress() {
  for file in $1
  do
    if [ -f "$file" ]
    then
      printf "\ncompressing $(basename -- $file) ..."
      compress "$file"
      printf "\ndone."
    elif [ -d "$file" ]
    then
      local subdir="$file/*"
      batchCompress "$subdir"
    fi
  done
}

batchCompress "$directory"
printf "\ndone\n"
