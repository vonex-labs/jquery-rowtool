# jQuery rowTool

### Dynamically add rows to a table from a Qty. input

Here's the job: you need to dymically add a whole bunch of rows to a table, based on a qty. input box.
You don't want to write the same 100 lines of code all the time.
 
Here's the solution: use this plugin!

This plugin will automatically ensure that the rows are added and removed from the table.

Limits can be placed (`min` and `max` values on the qty. input box)

You can add rows on the server side, this plugin will not clobber them.

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="dist/jquery.rowtool.min.js"></script>
	```

3. Write the HTML:

    ```html
    <p>How many things do you want?</p>
    <input id="service-qty" name="service-qty" type="number" value="0" min="0" max="99" aria-valuemin="1">
    
     
    <!-- build a template for the rows... -->
    <script type="html/service-template" name="service-template">
        <tr class="service">
            <td>#<span class="service-qty-number"></span></td>
            <td><input type="text" name="service[][nickname]" placeholder="Nicky"></td>
            <td><input type="text" name="service[][firstname]" placeholder="Nicholas"></td>
            <td><input type="text" name="service[][lastname]" placeholder="Jonas"></td>
        </tr>
    </script>
     
    <!-- and add a table that we will modify! -->
    <table class="services">
        <thead>
        <tr>
            <th>ID</th>
            <th>Nick name</th>
            <th>First name</th>
            <th>Last name</th>
        </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
    ```

4. Call the plugin:

	```javascript
    $(".services").rowTool({
        // The template for the row.
        template: $('script[type="html/service-template"][name="service-template"]'),
       
        // This is the name of the input box(es) that we want to modify
        groupName: 'service',
       
        // The input boxes are called this...
        inputBoxes: ['nickname', 'firstname', 'lastname'],
       
        // This is the element with the input box that has the qty.
        // When it changes, we want to update the table with this # of rows
        qtyInput: $("#service-qty"),
       
        // [Optional] This is the class that has the # of the row.
        qtyRow: ".service-qty-number",

        // [Optional] Callbacks when an element is ready.
        //  First parameter is the input box
        //  Second parameter is the row that the input box is on
        inputBoxReady: {
            nickname: function($nickname, $row) {
                $nickname.on('change', function() {
                    console.log($(this).val();
                });
            }
        }
    });
	```

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── dist/
│   ├── jquery.rowtool.js
│   └── jquery.rowtool.min.js
├── src/
│   └── jquery.rowtool.js
├── .editorconfig
├── .gitignore
├── .jshintrc
├── .travis.yml
├── Gruntfile.js
└── package.json
```

#### [demo/](https://github.com/vonex-labs/jquery-rowtool/tree/master/demo)

Contains a simple HTML file to demonstrate the plugin.

## License

Software is licensed under the `MIT License`.

© [Vonex](https://www.vonex.com.au), 2016
