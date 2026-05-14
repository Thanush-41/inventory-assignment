using InventoryApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors();

var items = new List<InventoryItem>();
var nextId = 1;

app.MapGet("/api/items", () => items);

app.MapPost("/api/items", (InventoryItem item) =>
{
    item.Id = nextId++;
    items.Add(item);
    return Results.Created($"/api/items/{item.Id}", item);
});

app.Run();
