# Sizing
### A clean and simple webapp for real time collaboration on story size estimates

![Session example 1](https://github.com/iarejenius/sizing/blob/master/docs/session1.PNG)

## Requirements
- [.NET Core 2.2](https://dotnet.microsoft.com/download/dotnet-core/2.2)
- [Node.js](https://nodejs.org/)

## Running
Run
```
dotnet run
``` 
in the `src` directory to start web application. This will start both the AspNet Core backend and the Angular frontend.

## Testing

### Backend tests
Run
```
dotnet test
```
in the root directory to run xUnit tests against the .Net Core backend.

### Frontend tests
Run
```
ng test
```
in the `src\ClientApp` directory to run jasmine unit tests against the Angular frontend.
