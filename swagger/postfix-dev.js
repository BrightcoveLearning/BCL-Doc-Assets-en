function postfix() {
  var topbar_wrapper = document.getElementsByClassName('topbar-wrapper')[0],
    btn = document.createElement('button'),
    txt = ' (click to make the entire doc searchable)',
    span = document.createElement(span),
    description_div = document.getElementsByClassName('description')[0],
    opBlockSections = document.getElementsByClassName('opblock'),
    model_containers = document.getElementsByClassName('model-container'),
    rootURLdiv = document.createElement('div'),
    rootURLpre = document.createElement('pre'),
    rootURL = document.querySelector('div.servers select option').value,
    rootURLh4 = document.createElement('h4'),
    expand_all,
    img = document.createElement('img'),
    aDocs = document.createElement('a'),
    aHome = document.createElement('a'),
    p = document.createElement('p'),
    swaggerContainer = document.getElementsByClassName('swagger-container')[0],
    swaggerUI = document.getElementsByClassName('swagger-ui')[1],
    sideNav = document.createElement('div'),
    opBlockSections = document.getElementsByClassName('opblock-tag-section'),
    opBlockSectionLinks = document.querySelector('a.nostyle'),
    frag = document.createDocumentFragment(),
    navFrag = document.createDocumentFragment(),
    i,
    iMax,
    j,
    jMax;

  // add side nav
  swaggerContainer.setAttribute('style', 'position:relative');
  // sideNav.setAttribute('style', 'position:fixed;top:64px;width:300px;height:100%;overflow-y:scroll;margin-right:iem;border-right:1px #ccc solid;');
  sideNav.setAttribute('style', 'display:inline-block')
  // swaggerUI.setAttribute('style', 'position:fixed;left:300px;top:64px;overflow-y:scroll;margin-left:1em;');
  iMax = opBlockSections.length;
  for (i = 0; i < iMax; i++) {
    var h5 = document.createElement('h5'),
      ul = document.createElement('ul'),
      sectionA = document.createElement('a'),
      opBlockSection = opBlockSections[i],
      opBlocks = opBlockSection.querySelectorAll('opblock'),
      opBlockSectionLink = opBlockSection.querySelector('a.nostyle'),
      opBlockSectionHash = opBlockSectionLink.getAttribute('href'),
      opBlockTitle = opBlockSectionLink.querySelector('span').textContent;
      ul.setAttribute('style', 'list-style-type:none;');
      sectionA.setAttribute('href', opBlockSectionHash),
      sectionA.textContent = opBlockTitle;
      h5.appendChild(sectionA);
      jMax = opBlocks.length;
      for (j = 0; j < jMax; j++) {
        var li = document.createElement('li'),
          a = document.createElement('a'),
          opBlock = opBlocks[j];

          a.setAttribute('href', opBlock.querySelector('a.nostyle')).getAttribute('href');
          a.textContent = opBlock.querySelector('.opblock-summary-description').textContent;
          ul.appendChild(li);
          li.appendChild(a);
      }
      sideNav.appendChild(h5);
      sideNav.appendChild(ul);
  }
swaggerUI.insertAdjacentElement('beforebegin', sideNav);
// swaggerUI.setAttribute('style', 'position:fixed;left:300px;top:64px;overflow-y:scroll;margin-left:1em;');


  // add custom header
  img.setAttribute('src', 'https://learning-services-media.brightcove.com/doc-assets/general/images/bc-logo-ondark-small.png');
  img.setAttribute('alt', 'Brightcove');
  img.setAttribute('class', 'topbar-img');
  aDocs.setAttribute('href', 'https://support.brightcove.com');
  aDocs.setAttribute('class', 'topbar-a');
  aDocs.textContent = 'Brightcove Docs';
  aHome.setAttribute('href', 'https://docs.brightcove.com/index.html');
  aHome.setAttribute('class', 'topbar-a');
  aHome.textContent = 'API References Index';
  topbar_wrapper.innerHTML = '';
  frag.appendChild(img);
  frag.appendChild(aHome);
  frag.appendChild(aDocs);
  topbar_wrapper.appendChild(frag);
  swaggerContainer.setAttribute('style', 'position:relative');
  swaggerUI.setAttribute('style', 'display:inline-block;')
  sideNav
  // add expand all button
  btn.setAttribute('id', 'expand_all');
  btn.setAttribute('class', 'btn try-out__btn');
  btn.textContent = 'Expand All Sections';
  span.textContent = txt;
  p.appendChild(btn);
  p.appendChild(span);
  rootURLpre.textContent = rootURL;
  rootURLh4.textContent = "Root URL";
  rootURLdiv.appendChild(rootURLh4);
  rootURLdiv.appendChild(rootURLpre);
  // note that description_div is defined before postfix() is called
  description_div.appendChild(p);
  description_div.appendChild(rootURLdiv);
  expand_all = document.getElementById('expand_all');
  expand_all.addEventListener('click', function () {
    var str = '?docExpansion=full',
      prot = window.location.protocol,
      dom = window.location.hostname,
      path = window.location.pathname;
      console.log('prot', prot);
      console.log('dom', dom);
      console.log('path', path);
    console.log('href', prot + '//' + dom + path + str);

      window.location.href = prot + '//' + dom + path + str;
  });
}
