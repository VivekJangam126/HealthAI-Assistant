import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { History } from '../api/historyApi';

export const exportConversationToPDF = (conversation: History, userName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    
    yPosition += 5;
  };

  // Header
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('HealthAI Assistant', margin, 25);
  doc.setFontSize(12);
  doc.text('Conversation Export', margin, 35);

  yPosition = 50;
  doc.setTextColor(0, 0, 0);

  // Conversation Info
  addText('━'.repeat(80), 10);
  addText(`Feature: ${conversation.feature.toUpperCase()}`, 12, true);
  addText(`Date: ${format(new Date(conversation.createdAt), 'PPpp')}`, 10);
  addText(`User: ${userName}`, 10);
  addText('━'.repeat(80), 10);
  yPosition += 5;

  // Title
  addText(conversation.title, 14, true);
  yPosition += 5;

  // Messages
  conversation.messages.forEach((message, index) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Message header
    const bgColor = message.role === 'user' ? [229, 231, 235] : [219, 234, 254];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(margin - 5, yPosition - 5, maxWidth + 10, 8, 'F');
    
    doc.setTextColor(0, 0, 0);
    addText(message.role === 'user' ? 'YOU:' : 'AI ASSISTANT:', 11, true);
    
    // Message content
    addText(message.content, 10);
    yPosition += 5;

    // Separator
    if (index < conversation.messages.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    }
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages} | Generated on ${format(new Date(), 'PPpp')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `HealthAI_${conversation.feature}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};

export const exportAllConversationsToPDF = (conversations: History[], userName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Cover page
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('HealthAI Assistant', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  doc.setFontSize(18);
  doc.text('Complete Conversation History', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`User: ${userName}`, pageWidth / 2, pageHeight / 2 + 30, { align: 'center' });
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, pageWidth / 2, pageHeight / 2 + 45, { align: 'center' });
  doc.text(`Total Conversations: ${conversations.length}`, pageWidth / 2, pageHeight / 2 + 60, { align: 'center' });

  // Add each conversation
  conversations.forEach((conversation, index) => {
    doc.addPage();
    let yPosition = margin;

    // Conversation header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`Conversation ${index + 1} of ${conversations.length}`, margin, 20);

    yPosition = 40;
    doc.setTextColor(0, 0, 0);

    // Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(conversation.title, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Feature: ${conversation.feature} | Date: ${format(new Date(conversation.createdAt), 'PP')}`, margin, yPosition);
    yPosition += 15;

    // Messages (simplified for bulk export)
    conversation.messages.forEach((message) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(message.role === 'user' ? 'YOU:' : 'AI:', margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(message.content, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    });
  });

  // Save
  const fileName = `HealthAI_All_Conversations_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
