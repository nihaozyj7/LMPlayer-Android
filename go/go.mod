module localmusicplayer

go 1.26.0

require (
	github.com/dhowden/tag v0.0.0-20240417053706-3d75831295e8
	github.com/fsnotify/fsnotify v1.9.0
	github.com/gen2brain/malgo v0.11.26
	github.com/wailsapp/wails/v3 v3.0.0-beta.14
)

require (
	golang.org/x/mobile v0.0.0-20261011034528-197770444867 // indirect
	golang.org/x/sys v0.49.0 // indirect
)

replace github.com/wailsapp/wails/v3 => ./wailsshim
