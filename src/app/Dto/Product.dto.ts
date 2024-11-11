export interface Product{
    id: number
    name: String
    image: String
    set: String
    stock: number
    price: number
    description: String
    sub_category_id: number 
  }

export interface ProductItemCart{
    product: Product;
  quantity: number;
}
