Package.describe({
	summary: "jQuery Jcrop repackaged for Meteor"
});

Package.on_use(function (api) {
	api.use('jquery', 'client');
	api.add_files([
		'lib/Jcrop/js/jquery.Jcrop.js',
		'lib/Jcrop/css/jquery.Jcrop.css',
		'lib/Jcrop/css/Jcrop.gif'
	], 'client');
});
