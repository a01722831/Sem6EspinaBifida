export type InventoryStatus = 'in_stock' | 'out_of_stock' | 'low_stock'

export type InventoryItem = {
  id: number
  name: string
  categoryId: string
  categoryName: string
  description: string
  quantity: number
  status: InventoryStatus
}

export async function GET(){
    const res = await fetch("https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/inventario/obtenerInventario");
    const data = (await res.json()).items;

    function sentenceCase(sentence: String){
        return sentence[0].toUpperCase() + sentence.slice(1);
    }

    const inventory: InventoryItem[] = data.map((item : any) => ({
        id: item.id_articulo,
        name: item.nombre,
        categoryId: item.categoria,
        categoryName: sentenceCase(item.categoria),
        description: item.descripcion,
        quantity: item.inventario_actual,
        status: (item.inventario_actual > 0)? ((item.inventario_actual > item.stock_minimo) ? 'in_stock' : 'low_stock') : 'out_of_stock'
    }));

    return Response.json(inventory);
}