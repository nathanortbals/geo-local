using GeoLocal.Game;
using GeoLocal.GoogleMaps;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();
builder.Services.AddSignalR();
builder.Services.AddSingleton((sp) =>
{
    var httpClient = sp.GetRequiredService<HttpClient>();
    var googleMapsApiKey = builder.Configuration.GetValue<string>("GoogleMaps:ApiKey");
    return googleMapsApiKey is null
        ? throw new InvalidOperationException("Google Maps Api Key not set")
        : new GoogleMapsService(httpClient, googleMapsApiKey);
});
builder.Services.AddSingleton<GameService>();
builder.Services.AddSingleton<GameFactory>();
builder.Services.AddHostedService<GameWorker>();

// Configuration
var app = builder.Build();
app.UseCors(config =>
{
    var allowedOrigins = builder.Configuration.GetValue<string>("Cors:AllowedOrigins") ?? throw new InvalidOperationException("Cors Allowed Origins must be set");
    config.WithOrigins(allowedOrigins);
    config.AllowAnyHeader();
});
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.MapControllers();
app.MapHub<GameHub>("/game-hub");

app.Run();
