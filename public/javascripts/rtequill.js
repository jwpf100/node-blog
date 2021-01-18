const quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'blockquote', 'code-block', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  },
  placeholder: 'Article body goes here...',
  theme: 'snow',
});

const newContents = document.querySelector('input[name=body_delta]').value;
newContents.length > 0 ? quill.setContents(JSON.parse(newContents)) : null;

const form = document.querySelector('form');
form.onsubmit = () => {
  // Populate hidden form on submit
  var body = document.querySelector('input[name=body]');
  body.value = quill.root.innerHTML;
  //body.value = 'is this working?'

  var body_delta = document.querySelector('input[name=body_delta]');
  body_delta.value = JSON.stringify(quill.getContents());

  form.submit();
};

/*
  form.onsubmit = function () {
    // Populate hidden form on submit
    var about = document.querySelector('input[name=about]');
    about.value = JSON.stringify(quill.getContents());

    // No back end to actually submit to!
    form.submit();
    //alert('Open the console to see the submit data!')
    //return false;
  };
*/
