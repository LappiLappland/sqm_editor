export function findIndexOfChild(target: Element) {
  let i = 0;
  let current = target;
  while (current.previousElementSibling) {
    i++;
    current = current.previousElementSibling;
  }
  return i;
}

export function findClosestParent(target: HTMLElement, type: string) {
  let current: HTMLElement | null = target;

  const searchFor = type.toUpperCase();
  while (current) {
    if (current.tagName === searchFor) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export function scrollToChild(target: HTMLElement | null, child: HTMLElement | number) {
  if (!target) return;
  if (child instanceof HTMLElement) {
    target.scrollTop = child.offsetTop;
  } else {
    const childFound = target.children.item(child) as HTMLElement;
    if (childFound) {
      target.scrollTop = childFound.offsetTop;
    }
  }
}