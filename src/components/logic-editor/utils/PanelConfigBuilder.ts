const PanelConfigBuilder =
{
    buildGroup(name: string, nodes: number, title: string, rowHeight?: number) {
        const rows = Number.parseInt(nodes / 2);
        const flag = nodes % 2 == 0;
        return {
            name,
            title,
            graphHeight: (flag ? rows : rows + 1) * (rowHeight ? rowHeight : 70) + 10,
        }
    }

}

export default PanelConfigBuilder;