import { StyleSheet } from 'react-native';

const styles_parallax_scroll_view = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250, // HEADER_HEIGHT constant
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});

export default styles_parallax_scroll_view; 