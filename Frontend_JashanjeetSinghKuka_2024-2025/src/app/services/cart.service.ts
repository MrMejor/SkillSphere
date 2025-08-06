import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // BehaviorSubject to manage cart visibility
  private isCartVisible = new BehaviorSubject<boolean>(false);
  isCartVisible$ = this.isCartVisible.asObservable();

  // BehaviorSubject to manage cart items
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  constructor() {}

  // Toggle cart visibility
  toggleCart() {
    this.isCartVisible.next(!this.isCartVisible.value);
  }

  // Add a product to the cart
  addToCart(product: any) {
    const currentCart = this.cart.value;
    const existingProduct = currentCart.find((p) => p.id === product.id);

    if (existingProduct) {
      // If the product already exists, increase its quantity
      existingProduct.quantity += 1;
    } else {
      // If the product is new, add it to the cart
      currentCart.push({ ...product, quantity: 1 });
    }

    this.cart.next(currentCart); // Update the cart
  }

  // Update the quantity of a product in the cart
  updateQuantity(productId: number, quantity: number) {
    const currentCart = this.cart.value;
    const product = currentCart.find((p) => p.id === productId);

    if (product) {
      product.quantity = quantity;
      if (product.quantity <= 0) {
        // If quantity is 0 or less, remove the product from the cart
        this.removeFromCart(productId);
      } else {
        this.cart.next(currentCart); // Update the cart
      }
    }
  }

  // Remove a product from the cart
  removeFromCart(productId: number) {
    const currentCart = this.cart.value.filter((p) => p.id !== productId);
    this.cart.next(currentCart); // Update the cart
  }

  // Clear the entire cart
  clearCart() {
    this.cart.next([]); // Empty the cart
  }
}