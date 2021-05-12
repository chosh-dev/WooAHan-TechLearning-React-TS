export class Component {
  constructor(props) {
    this.props = props;
  }
}

//* dom구조로 변환
function renderElement(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  if (node === undefined) return;

  const $el = document.createElement(node.type);

  node.childern.map(renderElement).forEach((node) => {
    $el.appendChild(node);
  });

  return $el;
}

// root에 dom tree 그리기
export function render(vdom, container) {
  container.appendChild(renderElement(vdom));
}

// babel로 만들기
export function createElement(type, props, ...children) {
  if (typeof type === "function") {
    if (type.prototype instanceof Component) {
      const comp = new type({ ...props, children });
      return comp.render.call(comp);
    } else {
      return type.apply(null, [props, ...children]);
    }
  }
  return { type, props, childern };
}
