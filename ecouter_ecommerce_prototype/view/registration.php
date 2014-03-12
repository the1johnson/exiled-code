<?php
// THIS DOCUMENT CONTAINS THE REGISTRATION FORM
echo "<html><head>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<title>Registration</title></head>

<body>
<h2>Regsiter with Ecouter</h2>
<form action='../register_call.php' method='post' name='registration' target='_top'>

			<input name='userName' type='text' /> :Username
			<br />
			<br />
			<input name='password' type='password' /> :Password
			<br />
			<br />
			<input name='email' type='text' /> :Email Address
			<br />
			<br />
			<input name='fname' type='text' /> :First Name
			<br />
			<br />
			<input name='lname' type='text' /> :Last Name
			<br />
			<br />
			<input name='submit' type='submit' value='Submit' />
			</form>
		</body>
</html>
";

?>