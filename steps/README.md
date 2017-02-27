# steps
step tools

```javascript
stepsContainer.appendChild(steps.getDom(data));
steps.click(function(e, i){
  console.log(this);
  console.log(e, i);
});
```
### Step 1
init steps data. like this
```javascript
var data = [
  {
    text: 'step-1',
    class: 'front',
    url: 'http://www.google.com'
  },
  {
    text: 'step-2',
    class: 'front',
    active: true
  },
  {
    text: 'step-3',
    class: 'active'
  },
  {
    text: 'step-7',
    class: 'after'
  },
];
```
##### data introduce
- text: [required]. the text of step
- class: [required]. current class name, <code>font</code> <code>active</code> <code>after</code>, you can modify style to change every color
- url: [optional]. every step that you want to jump.
- active: [optional]. the step you want to height light.
### Step 2
get instance of Steps
```javascript
var steps = new Steps(data);
```
### Step 3
get steps container and append to this.
```javascript
var stepsContainer = document.getElementById('stepsContainer');
stepsContainer.appendChild(steps.getDom(data));
```
### Step 4
if you want to bind event for every step, you can do this
```javascript
steps.click(function(e, i){
  console.log(this); // this step dom instance
  console.log(e, i); // current event object and the index of steps.
});
```
