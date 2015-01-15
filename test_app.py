import unittest
import app, math

class FlaskrTestCase(unittest.TestCase):
    
    def setUp(self):
        self.app = app.app.test_client();

    def test_distance(self):
        dist = app.distance(1,2,3,5)
        assert dist == math.sqrt(13)
        
    def test_neg_distance(self):
        dist = app.distance(1,-2,-3,5)
        assert dist == math.sqrt(65)
        
    def test_get_data(self):
        response = app.get_data()
        assert len(response)!= 0
    
if __name__ == '__main__':
    unittest.main()