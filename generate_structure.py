# generate_structure.py
import os

def print_directory_tree(startpath, prefix=''):
    """Рекурсивно печатает дерево каталогов."""
    items = [item for item in os.listdir(startpath) if item != '.git'] # Исключаем .git
    pointers = ['├── '] * (len(items) - 1) + ['└── ']
    for pointer, item in zip(pointers, items):
        path = os.path.join(startpath, item)
        print(prefix + pointer + item)
        if os.path.isdir(path):
            extension = '│   ' if pointer == '├── ' else '    '
            print_directory_tree(path, prefix=prefix+extension)

if __name__ == "__main__":
    project_root = "." # Текущая директория
    project_name = os.path.basename(os.path.abspath(project_root))
    print(project_name + "/")
    print_directory_tree(project_root)