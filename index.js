import html from "choo/html"
import choo from "choo"
import store from "./src/store"
import ui from "views/ui"


var app = choo()
app.use(store)


function mainView(state, emit) {
  return html`
    <div
    class="app"
    onload=${onload}
    >
    ${MyButton(
      { onclick: () => console.log("yay!") },
      "Do Something",
      "Say Something Else"
    )}
    </div>
  `
}

app.route(`/*`, mainView)

var tree = app.start()
document.body.appendChild(tree)
