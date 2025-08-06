/**
 * Author: jashanjeetsingh
 * Created on 27/5/25 at 15:07
 * What we did in this class :-
 * // The changes are:
 */
package com.tienda.app.dtos.auth;
import java.time.LocalDateTime;
public class ChatMessageDTO
{
  private String sender;
  private String recipient;
  private String content;
  private LocalDateTime timestamp;

//  Getters and Setters

  public String getSender()
  {
    return sender;
  }
  public void setSender( String sender )
  {
    this.sender = sender;
  }
  public String getRecipient()
  {
    return recipient;
  }
  public void setRecipient( String recipient )
  {
    this.recipient = recipient;
  }
  public String getContent()
  {
    return content;
  }
  public void setContent( String content )
  {
    this.content = content;
  }
  public LocalDateTime getTimestamp()
  {
    return timestamp;
  }
  public void setTimestamp( LocalDateTime timestamp )
  {
    this.timestamp = timestamp;
  }
}


