import Nanocomponent from 'nanocomponent'
import styled from "styled-elements"
import html from nanohtml

const MyButton = styled.button`
  padding: 10px;
  border-radius: ${0}px;
  background: #f1f1f1;

  &:hover {
    background: #555;
  }
`

class Button extends Nanocomponent {
  constructor () {
    super()
    this.color = null
  }

  createElement (color) {
    this.color = color
    return html`
      <button style="background-color: ${color}">
        Click Me
      </button>
    `
  }

  // Implement conditional rendering
  update (newColor) {
    return newColor !== this.color
  }
}

export default Button