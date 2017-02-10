import sass

BASE_DIR = 'google_maps/public/'

sass.compile(
	dirname=(BASE_DIR + 'sass', BASE_DIR + 'css'),
	output_style='compressed',
)
