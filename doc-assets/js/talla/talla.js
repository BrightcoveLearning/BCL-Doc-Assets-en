var appID = 'e14ff9ed-2f8f-49f4-8bfa-f551757d55bb',
  talla_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Njg4MzA5NjR9.42xk8cnXFZll1kpm_M56A7prEgsNzldJGfXe45k0gpM',
  talla_parent = document.getElementById('talla_widget'),
  talla_button = document.getElementById('talla_button');

if (Talla) {
  Talla.widget = Talla.init(
    appID,
    Talla.OptionLoadExternalKB, 
    Talla.OptionBotName('Questions?')
  );
  function talla_start() {
    Talla.widget.display(Talla.OptionJWTCredentials(talla_token), Talla.OptionParent(talla_parent));
  }
  talla_button.addEventListener('click', talla_start)
}