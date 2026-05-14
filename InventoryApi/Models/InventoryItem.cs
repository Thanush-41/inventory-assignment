namespace InventoryApi.Models;

public class InventoryItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string StockStatus => Quantity switch
    {
        0 => "Out of Stock",
        < 10 => "Low Stock",
        _ => "In Stock"
    };
}
