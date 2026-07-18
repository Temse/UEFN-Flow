sed -i -e '222,223c\
      return cached ? deduplicateById(JSON.parse(cached)) : [];\
    } catch (e) {\
      return [];\
    }\
' src/components/Dashboard.tsx

sed -i -e '229,230c\
      return cached ? false : true;\
    } catch (e) {\
      return true;\
    }\
' src/components/Dashboard.tsx
