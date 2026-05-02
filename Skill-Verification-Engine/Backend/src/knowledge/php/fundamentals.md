PHP is a server-side scripting language designed for web development, embedded in HTML.

PHP code is enclosed in <?php ... ?> tags. Files use the .php extension.

Variables start with $: $name = "Alice"; $age = 30;

PHP is dynamically and weakly typed. Type juggling converts types automatically.

Arrays are ordered maps: $arr = [1, 2, 3]; or associative: $user = ["name" => "Alice", "age" => 30].

Array functions: array_push, array_pop, array_merge, array_map, array_filter, in_array, count.

Strings support single quotes (literal) and double quotes (variable interpolation): "Hello $name".

String functions: strlen, strpos, substr, str_replace, explode, implode, trim.

OOP in PHP: class User { public $name; public function greet() { return "Hi {$this->name}"; } }.

Visibility: public, protected, private. Inheritance with extends, interfaces with implements.

Abstract classes and methods: abstract class Shape { abstract public function area(); }.

Traits provide horizontal code reuse: trait Timestampable { } used with use Timestampable;.

Namespaces organize code: namespace App\Models; accessed with use App\Models\User;.

Composer is PHP's dependency manager. composer.json defines project dependencies.

PSR standards define coding style (PSR-1, PSR-12), autoloading (PSR-4), and HTTP interfaces (PSR-7).

Autoloading: Composer's PSR-4 autoloader maps namespaces to directories.

Sessions track users across requests: session_start(); $_SESSION["user"] = "Alice";

Form handling: $_GET, $_POST, $_REQUEST superglobals receive form data.

Laravel is a popular PHP framework using MVC architecture, Eloquent ORM, Blade templates, and Artisan CLI.

Laravel routing: Route::get('/users', [UserController::class, 'index']);

Laravel middleware: filters HTTP requests; applied globally or per-route.
