package application

import "errors"

// ErrDialogUnsupported 表示当前平台没有系统对话框（Android 端用 SAF，由 Kotlin 侧负责）。
var ErrDialogUnsupported = errors.New("dialog: unsupported on this platform")

// DialogManager 是系统对话框管理器的替身。
type DialogManager struct{}

// FileDialog 是文件对话框构建器的替身。
type FileDialog struct{}

// OpenFile 开始构建一个打开对话框。
func (m *DialogManager) OpenFile() *FileDialog { return &FileDialog{} }

// SetTitle 设置对话框标题（无副作用）。
func (f *FileDialog) SetTitle(string) *FileDialog { return f }

// SetMessage 设置提示文案（无副作用）。
func (f *FileDialog) SetMessage(string) *FileDialog { return f }

// SetDirectory 设置初始目录（无副作用）。
func (f *FileDialog) SetDirectory(string) *FileDialog { return f }

// SetFilename 设置默认文件名（无副作用）。
func (f *FileDialog) SetFilename(string) *FileDialog { return f }

// AddFilter 添加过滤器（无副作用）。
func (f *FileDialog) AddFilter(string, string) *FileDialog { return f }

// CanChooseFiles 设置是否可选文件（无副作用）。
func (f *FileDialog) CanChooseFiles(bool) *FileDialog { return f }

// CanChooseDirectories 设置是否可选目录（无副作用）。
func (f *FileDialog) CanChooseDirectories(bool) *FileDialog { return f }

// CanCreateDirectories 设置是否可新建目录（无副作用）。
func (f *FileDialog) CanCreateDirectories(bool) *FileDialog { return f }

// AllowsMultipleSelection 设置是否多选（无副作用）。
func (f *FileDialog) AllowsMultipleSelection(bool) *FileDialog { return f }

// PromptForSingleSelection 在 Android 上直接失败，由调用方回退到手输路径。
func (f *FileDialog) PromptForSingleSelection() (string, error) {
	return "", ErrDialogUnsupported
}

// PromptForMultipleSelection 同上。
func (f *FileDialog) PromptForMultipleSelection() ([]string, error) {
	return nil, ErrDialogUnsupported
}
