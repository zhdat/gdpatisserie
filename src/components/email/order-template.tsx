import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderEmailProps {
  orderId: string;
  customerName: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  deliveryDate: Date;
  deliveryTime: string;
  isForAdmin?: boolean; // Pour changer le message si c'est pour le chef
}

export const OrderEmail: React.FC<OrderEmailProps> = ({
                                                        orderId,
                                                        customerName,
                                                        items,
                                                        totalAmount,
                                                        deliveryDate,
                                                        deliveryTime,
                                                        isForAdmin = false,
                                                      }) => {
  const formattedDate = new Date(deliveryDate).toLocaleDateString('fr-FR');
  const previewText = isForAdmin
    ? `Nouvelle commande de ${customerName} !`
    : `Confirmation de votre commande chez GD Pâtisserie`;

  return (
    <Html>
      <Head/>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isForAdmin ? '👨‍🍳 Nouvelle Commande !' : 'Merci pour votre commande ! 🍰'}
          </Heading>

          <Text style={text}>
            {isForAdmin
              ? `${customerName} vient de passer commande.`
              : `Bonjour ${customerName}, nous avons bien reçu votre commande.`}
          </Text>

          <Section style={box}>
            <Text style={paragraph}>
              <strong>Commande :</strong> #{orderId.slice(-4).toUpperCase()}<br/>
              <strong>Date prévue :</strong> {formattedDate}<br/>
              <strong>Créneau :</strong> {deliveryTime}
            </Text>
          </Section>

          <Hr style={hr}/>

          <Section>
            <Text style={paragraph}><strong>Détail :</strong></Text>
            <ul style={{paddingLeft: '20px'}}>
              {items.map((item) => (
                <li key={item.id} style={{marginBottom: '8px', color: '#444'}}>
                  {item.quantity}x <strong>{item.name}</strong> - {(item.price * item.quantity).toFixed(2)} €
                </li>
              ))}
            </ul>
          </Section>

          <Hr style={hr}/>

          <Text style={total}>
            Total à régler : {totalAmount.toFixed(2)} €
          </Text>

          {!isForAdmin && (
            <Text style={footer}>
              Le paiement se fera à la livraison. Nous vous appellerons bientôt pour confirmer.
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
};

// Styles simples (CSS-in-JS pour les emails)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  marginTop: '20px',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  maxWidth: '600px',
};

const h1 = {
  color: '#d97706', // Amber-600
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const box = {
  padding: '24px',
  backgroundColor: '#fef3c7', // Amber-100
  borderRadius: '4px',
  margin: '24px 24px',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const total = {
  fontSize: '20px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  paddingRight: '24px',
  color: '#111',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
  textAlign: 'center' as const,
};

export default OrderEmail;