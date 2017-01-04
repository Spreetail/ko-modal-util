# Knockout Bootstrap Modal Utility
A modal utility to make using and navigating bootstrap modals easier.

## Getting Started
If you have included the ko-modal-util script on your page you already have an instance of the modal controller at ko.Modal. Note: to use this script you must have bootstrap and knockout included before ko-modal-util[.min].js.
* [Knockout](https://www.knockoutjs.com/)
* [Bootstrap v3](https://www.getboostrap.com/)

#### Show
Once there show a modal by supplying an object containing the following options
```
ko.Modal.show({
  template: (required),
  [title]: (optional),  
  [model]: (optional according to template bindings),  
}, [callback]);
```

#### Hide
```
ko.Modal.hide([callback]);
```

#### Example
```
<button id="basic-modal-launch" class="btn btn-primary">Launch Modal</button>
```
```
<script id="basic-modal-template" type="text/html">
  <p>Here is a sample modal launched from the modal utility controller....</p>
</script>
```
```
$(document).ready(function() {
  
  
  $('#basic-modal-launch').click(function() {
    ko.Modal.show({
      title: 'Basic Modal',
      template: 'basic-modal-template'
    });
  });
});
```

## Developers
Before developing or running the examples be sure to have the following installed:
* [Npm](https://www.npmjs.com/)

Then pull down dependencies by running the following commands:
```
npm install
```
Once installed you may run the example/test server and build your resources with:
```
npm start
```