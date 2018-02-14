var request = require('request');
request('https://www.googleapis.com/customsearch/v1?key=AIzaSyD8l4vk5uqWWEPch0BQfMOqyR3RDeuCrb4&cx=012686465476344779243:leo8px30e1a&searchType:image&q=pigs', function (error, response, body) {
    if(error){
        console.log('something went wrong!');
        console.log(error);
    } else{
        if(response.statusCode == 200){
            var parsedData = JSON.parse(body);
            console.log(parsedData.items[0].pagemap.cse_image[0].src);
            console.log(parsedData.items[0].snippet);
            console.log(parsedData.items[0].link);
        }
    }
}); 