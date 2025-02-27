const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Incoming request...");

  const path = req.url;
  console.log("Requested URL:", path);

  switch (path) {
    case "/":
      res.write(
        "<h1 style='color:purple; text-align:center;'>Welcome to the Home Page</h1> <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>"
        
      );
      res.end();
      break;
    case "/services":
      res.write(
        "<h1 style='color:red; text-align:center;'>Our Services</h1><p style='text-align:center;'>We provide top-notch solutions!</p>"
      );
      res.end();
      break;
    case "/team":
      res.write(
        "<h1 style='color:purple; text-align:center;'>Meet Our Team</h1><p style='text-align:center;'>We have an amazing crew!</p>"
      );
      res.end();
      break;
    default:
      res.write(
        "<h1 style='color:red; text-align:center;'>404 - Page Not Found</h1><p style='text-align:center;'>Oops! The page you are looking for does not exist.</p>"
      );
      res.end();
  }
});

server.listen(8005, () =>
  console.log("Server is up and running on port 8005!")
);