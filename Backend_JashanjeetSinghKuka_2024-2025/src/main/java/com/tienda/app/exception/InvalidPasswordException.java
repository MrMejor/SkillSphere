/**
 * Author: jashanjeetsingh
 * Created on 12/3/25 at 15:34
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.exception;
public class InvalidPasswordException extends RuntimeException
{    public InvalidPasswordException(String message) {
  super(message);
}
}
